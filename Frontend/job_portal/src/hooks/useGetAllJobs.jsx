import { useJob } from '../context/JobContext'
import { JOB_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { useEffect } from 'react'

const useGetAllJobs = () => {
    const { setAllJobs, searchedQuery } = useJob();
    useEffect(()=>{
        const fetchAllJobs = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get?keyword=${searchedQuery}`,{withCredentials:true});
                if(res.data.success){
                    setAllJobs(res.data.jobs);
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllJobs();
    },[searchedQuery, setAllJobs])
}

export default useGetAllJobs