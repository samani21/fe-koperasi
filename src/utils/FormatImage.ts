export const formatImage = (image: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!image || image === '') return;

    return baseUrl + image;
};