import { compressAccurately } from 'image-conversion';

const getImageNaturalSize = (file) => {
  return new Promise((resolve) => {
    const src = URL.createObjectURL(file);
    const image = document.createElement('img');
    image.onload = function () {
      console.log('图片分辨率为：' + image.naturalWidth + '×' + image.naturalHeight);
      resolve({
        width: image.naturalWidth,
        height: image.naturalHeight,
      });
    };
    image.src = src;
  });
};

export default async (file) => {
  const imageSize = await getImageNaturalSize(file);

  const width = imageSize?.width >= 640 ? imageSize?.width : 640;
  const height = imageSize?.height >= 480 ? imageSize?.height : 480;

  return new Promise((resolve, reject) => {
    compressAccurately(file, {
      size: 170,
      // eslint-disable-next-line no-param-reassign
      type: 'image/jpeg',
      width: width,
      height: height,
    })
      .then((res) => {
        if (!res.name) {
          res.name = file.name;
        }
        resolve(
          new File([res], res.name, {
            type: res.type,
          }),
        );
      })
      .catch((error) => {
        reject(error);
      });
  });
};
