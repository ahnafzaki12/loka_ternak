const { v2: cloudinary } = require('cloudinary');

const getCloudinaryConfig = () => {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
    const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
    const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

    if (!cloudName || !apiKey || !apiSecret) {
        throw new Error('Konfigurasi Cloudinary belum lengkap di file .env');
    }

    return {
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
    };
};

cloudinary.config({
    ...getCloudinaryConfig(),
});

const uploadImageBuffer = (buffer, folder = 'lokaternak/ternak') => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: 'image',
            },
            (error, result) => {
                if (error) {
                    return reject(error);
                }

                resolve(result);
            }
        );

        uploadStream.end(buffer);
    });
};

const deleteImage = async (publicId) => {
    if (!publicId) {
        return null;
    }

    return await cloudinary.uploader.destroy(publicId);
};

module.exports = {
    uploadImageBuffer,
    deleteImage,
};
