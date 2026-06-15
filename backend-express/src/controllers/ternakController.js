const prisma = require('../lib/prisma');
const { deleteImage, uploadImageBuffer } = require('../utils/cloudinary');

// CREATE
exports.createTernak = async (req, res) => {
    try {
        const { tag, jenis, berat, tinggi, kelamin, status, umurBulan, tanggalLahir } = req.body;

        // Validasi input
        if (!tag || !jenis || !berat || !tinggi || !kelamin || !status) {
            return res.status(400).json({ message: 'Semua field wajib diisi' });
        }

        let gambarUrl = null;
        let gambarPublicId = null;

        if (req.file) {
            const uploadedImage = await uploadImageBuffer(req.file.buffer);
            gambarUrl = uploadedImage.secure_url;
            gambarPublicId = uploadedImage.public_id;
        }

        const newTernak = await prisma.ternak.create({
            data: {
                tag,
                jenis,
                berat: parseFloat(berat),
                tinggi: parseFloat(tinggi),
                kelamin,
                status,
                // Default value jika tidak disediakan
                umurBulan: umurBulan ? parseInt(umurBulan) : 0,
                tanggalLahir: tanggalLahir ? new Date(tanggalLahir) : new Date(),
                gambarUrl,
                gambarPublicId,
            },
        });

        res.status(201).json({ message: 'Data ternak berhasil ditambahkan', data: newTernak });
    } catch (error) {
        console.error('Error createTernak:', error);
        // Handle unique constraint error on tag
        if (error.code === 'P2002') {
             return res.status(400).json({ message: 'ID Tag sudah terdaftar' });
        }
        res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
    }
};

// READ ALL
exports.getAllTernak = async (req, res) => {
    try {
        const ternak = await prisma.ternak.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json({ data: ternak });
    } catch (error) {
        console.error('Error getAllTernak:', error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
    }
};

// READ ONE
exports.getTernakById = async (req, res) => {
    try {
        const { id } = req.params;
        const ternak = await prisma.ternak.findUnique({
            where: { id },
            include: {
                riwayatPertumbuhan: { orderBy: { tanggal: 'asc' } },
                riwayatPakan: { orderBy: { tanggal: 'desc' } },
                riwayatKesehatan: { orderBy: { tanggal: 'desc' } },
                aktivitas: { orderBy: { tanggal: 'desc' } },
            }
        });

        if (!ternak) {
            return res.status(404).json({ message: 'Data ternak tidak ditemukan' });
        }

        res.status(200).json({ data: ternak });
    } catch (error) {
        console.error('Error getTernakById:', error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
    }
};

// UPDATE
exports.updateTernak = async (req, res) => {
    try {
        const { id } = req.params;
        const { tag, jenis, berat, tinggi, kelamin, status, umurBulan, tanggalLahir } = req.body;

        const updateData = {};
        if (tag) updateData.tag = tag;
        if (jenis) updateData.jenis = jenis;
        if (berat) updateData.berat = parseFloat(berat);
        if (tinggi) updateData.tinggi = parseFloat(tinggi);
        if (kelamin) updateData.kelamin = kelamin;
        if (status) updateData.status = status;
        if (umurBulan !== undefined) updateData.umurBulan = parseInt(umurBulan);
        if (tanggalLahir) updateData.tanggalLahir = new Date(tanggalLahir);

        if (req.file) {
            const existingTernak = await prisma.ternak.findUnique({
                where: { id },
                select: { gambarPublicId: true },
            });

            if (!existingTernak) {
                return res.status(404).json({ message: 'Data ternak tidak ditemukan' });
            }

            const uploadedImage = await uploadImageBuffer(req.file.buffer);
            updateData.gambarUrl = uploadedImage.secure_url;
            updateData.gambarPublicId = uploadedImage.public_id;

            if (existingTernak.gambarPublicId) {
                await deleteImage(existingTernak.gambarPublicId);
            }
        }

        const updatedTernak = await prisma.ternak.update({
            where: { id },
            data: updateData,
        });

        res.status(200).json({ message: 'Data ternak berhasil diperbarui', data: updatedTernak });
    } catch (error) {
        console.error('Error updateTernak:', error);
        if (error.code === 'P2025') {
             return res.status(404).json({ message: 'Data ternak tidak ditemukan' });
        }
        if (error.code === 'P2002') {
            return res.status(400).json({ message: 'ID Tag sudah terdaftar' });
       }
        res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
    }
};

// DELETE
exports.deleteTernak = async (req, res) => {
    try {
        const { id } = req.params;

        const ternak = await prisma.ternak.findUnique({
            where: { id },
            select: { gambarPublicId: true },
        });

        if (!ternak) {
            return res.status(404).json({ message: 'Data ternak tidak ditemukan' });
        }

        await prisma.ternak.delete({
            where: { id },
        });

        if (ternak.gambarPublicId) {
            await deleteImage(ternak.gambarPublicId);
        }

        res.status(200).json({ message: 'Data ternak berhasil dihapus' });
    } catch (error) {
        console.error('Error deleteTernak:', error);
        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'Data ternak tidak ditemukan' });
        }
        res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
    }
};
