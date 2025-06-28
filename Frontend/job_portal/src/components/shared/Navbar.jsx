'use client'
import React from 'react'
import Popover from '@mui/material/Popover'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { LogOut, User2 } from 'lucide-react'
import Link from 'next/link'
import { useNavigation } from '../../hooks/useNavigation'
import { useAuth } from '../../context/AuthContext'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'

const Navbar = () => {
    const { user, logout } = useAuth();
    const { navigate } = useNavigation();

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
            if (res.data.success) {
                logout();
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            const errorMessage = error.response?.data?.message || error.message || 'Something went wrong';
            toast.error(errorMessage);
        }
    }
    const [anchorEl, setAnchorEl] = React.useState(null)
    const open = Boolean(anchorEl)
    const id = open ? 'user-popover' : undefined

    const handleOpen = (event) => setAnchorEl(event.currentTarget)
    const handleClose = () => setAnchorEl(null)

    return (
        <div className='bg-white'>
            <div className='flex items-center justify-between mx-auto max-w-7xl h-16'>
                <div>
                    <h1 className='text-2xl font-bold'>Next<span className='text-[#F83002]'>Step</span></h1>
                </div>
                <div className='flex items-center gap-12'>
                    <ul className='flex font-medium items-center gap-5'>
                        {
                            user && user.role === 'recruiter' ? (
                                <>
                                    <li><Link href="/admin/companies">Companies</Link></li>
                                    <li><Link href="/admin/jobs">Jobs</Link></li>
                                </>
                            ) : (
                                <>
                                    <li><Link href="/">Home</Link></li>
                                    <li><Link href="/jobs">Jobs</Link></li>
                                    <li><Link href="/browse">Browse</Link></li>
                                </>
                            )
                        }


                    </ul>
                    {
                        !user ? (
                            <div className='flex items-center gap-2'>
                                <Link href="/login"><Button variant="outlined">Login</Button></Link>
                                <Link href="/signup"><Button className="bg-[#6A38C2] hover:bg-[#5b30a6]" variant="contained">Signup</Button></Link>
                            </div>
                        ) : (
                            <>
                              <Avatar className="cursor-pointer" src={user?.profile?.profilePhoto} onClick={handleOpen} />
                              <Popover id={id} open={open} anchorEl={anchorEl} onClose={handleClose}
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                                transformOrigin={{ vertical: 'top', horizontal: 'center' }}>
                                <Box className="w-80 p-4">
                                  <Box className='flex gap-2 items-center'>
                                    <Avatar src={user?.profile?.profilePhoto} />
                                    <Box>
                                      <Typography className='font-medium'>{user?.fullname}</Typography>
                                      <Typography className='text-sm text-muted-foreground'>{user?.profile?.bio}</Typography>
                                    </Box>
                                  </Box>
                                  <Box className='flex flex-col my-2 text-gray-600'>
                                    {user && user.role === 'student' && (
                                      <div className='flex w-fit items-center gap-2 cursor-pointer'>
                                        <User2 />
                                        <Button variant="text"><Link href="/profile">View Profile</Link></Button>
                                      </div>
                                    )}
                                    <div className='flex w-fit items-center gap-2 cursor-pointer'>
                                      <LogOut />
                                      <Button onClick={logoutHandler} variant="text">Logout</Button>
                                    </div>
                                  </Box>
                                </Box>
                              </Popover>
                            </>
                        )
                    }

                </div>
            </div>

        </div>
    )
}

export default Navbar