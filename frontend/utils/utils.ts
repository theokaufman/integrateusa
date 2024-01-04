export const sortOnOrder = (
  firstString: string,
  secondString: string,
  order: string[]
) => {
  const getIndex = (str: string) => order.indexOf(str);

  return getIndex(firstString) - getIndex(secondString);
};

const getQueryParams = (url: string) => {
  let queryParams = {} as { [key: string]: string };

  let anchor = document.createElement("a");
  anchor.href = url;

  let queryStrings = anchor.search.substring(1);
  let params = queryStrings.split("&");

  for (var i = 0; i < params.length; i++) {
    var pair = params[i].split("=");
    queryParams[pair[0]] = decodeURIComponent(pair[1]);
  }
  return queryParams;
};

export const getParamsInfo = (url: string) => {
  const queryParams = getQueryParams(url);

  const paramsId = queryParams.id;
  const paramsName = queryParams.name;
  const paramsLevel = queryParams.level;
  const paramsXMin = queryParams.xmin;
  const paramsXMax = queryParams.xmax;
  const paramsYMin = queryParams.ymin;
  const paramsYMax = queryParams.ymax;

  const completeParams =
    !!paramsId &&
    !!paramsName &&
    !!paramsLevel &&
    !!paramsXMin &&
    !!paramsXMax &&
    !!paramsYMin &&
    !!paramsYMax;

  if (completeParams) {
    return {
      id: paramsId,
      selectedName: paramsName.replace(/\+/g, " "),
      level: parseInt(paramsLevel),
      bounds: {
        lngmin: parseFloat(paramsXMin),
        lngmax: parseFloat(paramsXMax),
        latmin: parseFloat(paramsYMin),
        latmax: parseFloat(paramsYMax),
      },
    };
  }

  return null;
};
