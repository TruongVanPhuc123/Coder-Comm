import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import apiService from "../../app/apiService";
import { COMMENTS_PER_POST } from "../../app/config";

const initialState = {
  isLoading: false,
  error: null,
  commentsByPost: {},
  totalCommentsByPost: {},
  currentPageByPost: {},
  commentsById: {},
};

const slice = createSlice({
  name: "comment",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },

    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    getCommentsSuccess(state, action) {
      state.isLoading = false;
      state.error = "";
      const { postId, comments, count, page } = action.payload;
      console.log(action.payload)
      comments.forEach(
        (comment) => (state.commentsById[comment._id] = comment)
      );
      state.commentsByPost[postId] = comments
        .map((comment) => comment._id)
        .reverse();
      state.totalCommentsByPost[postId] = count;
      state.currentPageByPost[postId] = page;
    },

    createCommentSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
    },

    sendCommentReactionSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      const { commentId, reactions } = action.payload;
      state.commentsById[commentId].reactions = reactions;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteComments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteComments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        const newPost = action.payload;
        console.log(newPost)
        // state.currentPageByPost[newPost._id] = newPost;
        state.commentsById.pop(newPost._id);
      })
      .addCase(deleteComments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  }
});

export default slice.reducer;

export const getComments =
  ({ postId, page = 1, limit = COMMENTS_PER_POST }) =>
    async (dispatch) => {
      dispatch(slice.actions.startLoading());
      try {
        const params = {
          page: page,
          limit: limit,
        };
        const response = await apiService.get(`/posts/${postId}/comments`, {
          params,
        });
        dispatch(
          slice.actions.getCommentsSuccess({
            ...response.data,
            postId,
            page,
          })
        );
      } catch (error) {
        dispatch(slice.actions.hasError(error.message));
        toast.error(error.message);
      }
    };

export const createComment =
  ({ postId, content }) =>
    async (dispatch) => {
      dispatch(slice.actions.startLoading());
      try {
        const response = await apiService.post("/comments", {
          content,
          postId,
        });
        dispatch(slice.actions.createCommentSuccess(response.data));
        dispatch(getComments({ postId }));
      } catch (error) {
        dispatch(slice.actions.hasError(error.message));
        toast.error(error.message);
      }
    };

export const sendCommentReaction =
  ({ commentId, emoji }) =>
    async (dispatch) => {
      dispatch(slice.actions.startLoading());
      try {
        const response = await apiService.post(`/reactions`, {
          targetType: "Comment",
          targetId: commentId,
          emoji,
        });
        dispatch(
          slice.actions.sendCommentReactionSuccess({
            commentId,
            reactions: response.data,
          })
        );
      } catch (error) {
        dispatch(slice.actions.hasError(error.message));
        toast.error(error.message);
      }
    };

export const deleteComments = createAsyncThunk('deleteComments', async ({ commentId, postId }, thunkApi) => {
  const response = await apiService.delete(`/comments/${commentId}`)
  // thunkApi.dispatch(getComments({ postId }));
  return response.data
})
