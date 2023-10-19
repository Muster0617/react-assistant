// @ts-nocheck

export default class OperateBraftEditorImg {
  constructor() {
    this.urlMap = [];
    this.imgReg = /<img.*?(?:>|\/>)/gi;
    this.srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
    this.relativePathReg = /relativePath=[\'\"]?([^\'\"]*)[\'\"]?/i;
  }

  escape2Html = (str) => {
    const arrEntities = { lt: '<', gt: '>', nbsp: ' ', amp: '&', quot: '"' };
    return str.replace(/&(lt|gt|nbsp|amp|quot);/gi, function (all, t) {
      return arrEntities[t];
    });
  };

  removeFormBraftEditorImgSrc = (htmlCode = '') => {
    const imgArr = htmlCode?.match(this.imgReg) || [];
    const srcList = imgArr.map((item) => item?.match(this.srcReg)[1]);
    for (const src of srcList) {
      const index = srcList?.indexOf(src);
      const relativePath = imgArr[index]?.match(this.relativePathReg)?.[1] || '';
      // eslint-disable-next-line no-param-reassign
      htmlCode = htmlCode?.replace(src, `#${index + 1}`);
      if (!relativePath) {
        // eslint-disable-next-line no-param-reassign
        htmlCode = htmlCode?.replace(
          `src="#${index + 1}"`,
          `src="#${index + 1}" relativePath="${
            this.urlMap?.find((row) => row.src == this.escape2Html(src))?.relativePath
          }"`,
        );
      }
    }
    return htmlCode;
  };
  getFormBraftEditorRelativePath = (htmlCode = '') => {
    const imgArr = htmlCode?.match(this.imgReg) || [];

    const srcList = imgArr.map((item) => this.escape2Html(item?.match(this.srcReg)?.[1]));
    const relativePathList = imgArr.map((item, index) => {
      const relativePath = item?.match(this.relativePathReg)?.[1];
      if (relativePath) {
        return relativePath;
      } else {
        return this.urlMap?.find((row) => row.src == srcList?.[index])?.relativePath;
      }
    });
    return relativePathList?.join(',');
  };
  setFormBraftEditorImgSrc = (htmlCode = '', urlJoin = '') => {
    const imgArr = htmlCode?.match(this.imgReg) || [];
    const srcList = imgArr.map((item) => item?.match(this.srcReg)?.[1]);
    const relativePathList = imgArr.map((item) => item?.match(this.relativePathReg)[1]);
    const urlList = urlJoin?.split(',');
    for (const src of srcList) {
      const index = srcList?.indexOf(src);
      // eslint-disable-next-line no-param-reassign
      htmlCode = htmlCode.replace(src, urlList?.[index]);
      this.urlMap.push({
        relativePath: relativePathList?.[index],
        src: urlList?.[index],
      });
    }
    return htmlCode;
  };
}
