function NFTReducer(state = [], action) {
  switch (action.type) {
    case "FETCH_NFT":
      return action.payload;
    default:
      return state;
  }
}

export default NFTReducer;
