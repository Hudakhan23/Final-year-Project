import { useJob } from '../context/JobContext'
import { APPLICATION_API_END_POINT } from "@/utils/constant";
import axios from "axios"
import { useEffect } from "react"

const useGetAppliedJobs = () => {
    const { setAllAppliedJobs } = useJob();

    useEffect(()=>{
        const fetchAppliedJobs = async () => {
            try {
                const res = await axios.get(`${APPLICATION_API_END_POINT}/get`, {withCredentials:true});
                console.log(res.data);
                if(res.data.success){
                    setAllAppliedJobs(res.data.application);
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAppliedJobs();
    },[setAllAppliedJobs])
};
export default useGetAppliedJobs;