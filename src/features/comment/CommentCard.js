import React from "react";
import { Avatar, Box, IconButton, Paper, Stack, Typography } from "@mui/material";
import { fDate } from "../../utils/formatTime";
import CommentReaction from "./CommentReaction";
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch } from "react-redux";
import { deleteComments } from "./commentSlice";
import DeleteComfirm from "../../components/DeleteComfirm";

function CommentCard({ comment }) {
  const dispatch = useDispatch()


  return (
    <Stack direction="row" spacing={2}>
      <Stack direction='column' alignItems='center' spacing={3}>
        <Avatar alt={comment.author?.name} src={comment.author?.avatarUrl} />
        {/* <IconButton ></IconButton> */}
        <DeleteComfirm blank={comment} title="Comment" name="Comment" />
      </Stack>
      <Paper sx={{ p: 1.5, flexGrow: 1, bgcolor: "background.neutral" }}>
        <Stack
          direction="row"
          alignItems={{ sm: "center" }}
          justifyContent="space-between"
          sx={{ mb: 0.5 }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {comment.author?.name}
          </Typography>
          <Typography variant="caption" sx={{ color: "text.disabled" }}>
            {fDate(comment.createdAt)}
          </Typography>
        </Stack>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {comment.content}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <CommentReaction comment={comment} />
        </Box>
      </Paper>
    </Stack>
  );
}

export default CommentCard;
