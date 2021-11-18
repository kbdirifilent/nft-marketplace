function ProviderReducer(state = { loading: false, blockchain: null }, action) {
  switch (action.type) {
    case "PROVIDER_LOADING":
      return { ...state, loading: true };
    case "PROVIDER":
      return { ...state, loading: false, blockchain: action.payload };
    default:
      return state;
  }
}

export default ProviderReducer;
