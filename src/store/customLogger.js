const cumstomLogger = store => next => action => {
  const actionType = action.type;
  const type = actionType.slice(actionType.lastIndexOf('_') + 1);
  // const isExceptList = ['_index'];
  // const isExcept = isExceptList.some(item => item.indexOf(type) !== -1);
  // const isIncludeList = ['_init', '_pending', '_success', '_failure'];
  const isIncludeList = ['_success', '_failure'];
  const isInclude = isIncludeList.some(item => item.indexOf(type) !== -1);
  // if (!isExcept) console.log(`${actionType}`);
  if (isInclude) console.log(`${actionType}`);

  // console.log('action : ', action);
  const result = next(action);
  return result;
};

export default cumstomLogger;
