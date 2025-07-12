import { useCompany } from '../context/CompanyContext'
import { COMPANY_API_END_POINT} from '@/utils/constant'
import axios from 'axios'
import { useEffect } from 'react'

const useGetAllCompanies = () => {
    const { setCompanies } = useCompany();
    useEffect(()=>{
        const fetchCompanies = async () => {
            try {
                const res = await axios.get(`${COMPANY_API_END_POINT}/get`,{withCredentials:true});
                console.log('called');
                if(res.data.success){
                    setCompanies(res.data.companies);
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchCompanies();
    },[setCompanies])
}

export default useGetAllCompanies