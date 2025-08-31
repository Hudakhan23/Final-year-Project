import { useCompany } from '../context/CompanyContext'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { useEffect } from 'react'

const useGetCompanyById = (companyId) => {
    const { setSingleCompany } = useCompany();
    useEffect(()=>{
        const fetchSingleCompany = async () => {
            try {
                const res = await axios.get(`${COMPANY_API_END_POINT}/get/${companyId}`,{withCredentials:true});
                console.log(res.data.company);
                if(res.data.success){
                    setSingleCompany(res.data.company);
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchSingleCompany();
    },[companyId, setSingleCompany])
}

export default useGetCompanyById