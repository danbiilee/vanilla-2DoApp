// async, await 개별 에러 핸들링
export const handleError = (promise) => {
  return promise
    .then((data) => [undefined, data])
    .catch((error) => [error, undefined]);
};
