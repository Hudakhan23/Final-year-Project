import { useJob } from '../context/JobContext'
import { JOB_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { useEffect } from 'react'

const useGetAllAdminJobs = () => {
    const { setAllAdminJobs } = useJob();
    useEffect(()=>{
        const fetchAllAdminJobs = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/getadminjobs`,{withCredentials:true});
                if(res.data.success){
                    setAllAdminJobs(res.data.jobs);
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllAdminJobs();
    },[setAllAdminJobs])
}

export default useGetAllAdminJobs