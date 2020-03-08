const initialState = {
  data: [],
};

const user = (state = initialState, action) => {
  switch (action.type) {
    case '@user/SAVE_USER':
      return {
        data: action.user,
      };
    default:
      return state;
  }
};

export default user;
