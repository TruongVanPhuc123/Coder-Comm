import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import BuildIcon from '@mui/icons-material/Build';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, Card, CardHeader, Link, Stack, TextField, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom'
import { fDate } from '../../utils/formatTime';
import { updatePosts } from './postSlice';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: "10px",
    p: 4,
};


export default function UpdatePost({ post }) {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [content, setContent] = React.useState(post.content)
    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(updatePosts({ postId: post._id, content }))
        // console.log({ postId: post._id, content })
        handleClose()
    }

    return (
        <div>
            <Button variant="text" onClick={handleOpen} startIcon={<BuildIcon />} >Update Post</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>

                    <Card>
                        <CardHeader
                            disableTypography
                            avatar={
                                <Avatar src={post?.author?.avatarUrl} alt={post?.author?.name} />
                            }
                            title={
                                <Link
                                    variant="subtitle2"
                                    color="text.primary"
                                    component={RouterLink}
                                    sx={{ fontWeight: 600 }}
                                    to={`/user/${post.author._id}`}
                                >
                                    {post?.author?.name}
                                </Link>
                            }
                            subheader={
                                <Typography
                                    variant="caption"
                                    sx={{ display: "block", color: "text.secondary" }}
                                >
                                    {fDate(post.createdAt)}
                                </Typography>
                            }
                        />

                        <Stack spacing={2} sx={{ p: 3 }}>
                            <TextField name='content' value={content} onChange={(e) => setContent(e.target.value)} required />

                            {post.image && (
                                <Box
                                    sx={{
                                        borderRadius: 2,
                                        overflow: "hidden",
                                        height: 300,
                                        "& img": { objectFit: "cover", width: 1, height: 1 },
                                    }}
                                >
                                    <img src={post.image} alt="post" />
                                </Box>
                            )}
                            <Button variant="outlined" onClick={handleSubmit}>
                                Update
                            </Button>
                        </Stack>
                    </Card>
                </Box>
            </Modal>
        </div>
    );
}