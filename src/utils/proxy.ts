const proxyUrl = "";
const baseUrl = "https://api.avhd.cloud";
const getUrl = (relativeUrl: string): string => {
  return [proxyUrl, baseUrl, relativeUrl].filter((url) => url).join("/");
};

export { getUrl };
