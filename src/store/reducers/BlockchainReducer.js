function ProviderReducer(state = null, action) {
  switch (action.type) {
    case "PROVIDER":
      return action.payload;
    default:
      return state;
  }
}

export default ProviderReducer;
