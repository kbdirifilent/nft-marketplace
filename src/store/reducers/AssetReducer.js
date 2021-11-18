function NFTReducer(state = { loading: false, assets: [] }, action) {
  switch (action.type) {
    case "ASSETS_LOADING":
      return { ...state, loading: true };
    case "ASSETS":
      return { ...state, loading: false, assets: action.payload };
    default:
      return state;
  }
}

export default NFTReducer;
