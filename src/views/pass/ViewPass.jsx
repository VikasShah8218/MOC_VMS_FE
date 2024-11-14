import React from 'react';
import Dialog from '@mui/material/Dialog';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import PrintIcon from '@mui/icons-material/Print';
import passlogo from '../../assets/images/passlogo.png';
import modlogo from '../../assets/images/mod.png';
import { url } from '../../utils/Constants';
import { useTranslation } from 'react-i18next';


const ViewPass = ({ open, onClose, passData }) => {
    const { t, i18n } = useTranslation();
    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };
    const handlePrint = async () => {
        try {   
            const response = await fetch(`${url}/passes/pass-download/${passData.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(passData),
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch PDF');
            }
    
            // Use response.blob() to get the data as a Blob
            const pdfBlob = await response.blob();
            const pdfUrl = URL.createObjectURL(pdfBlob);
            window.open(pdfUrl, '_blank');
        } catch (error) {
            console.error("Error fetching PDF:", error);
        }
    };
    
    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth={true}
            maxWidth="lg"
            className="flex justify-center items-center"
        >
            <Paper className="bg-white p-4 printableArea shadow-md w-full" style={{ width: '800px', height: 'auto' }}>                <div className="grid grid-cols-3 gap-4 items-start border-2 border-gray-300 rounded-lg shadow-sm">
                <div className="absolute inset-0">
                    <IconButton onClick={handlePrint} className="fixed top-6 left-6 p-2">
                        <PrintIcon />
                    </IconButton>
                </div>
                <div className="col-span-1 p-2 border-r-2 border-gray-300">
                    <div className='flex flex-col items-center space-y-4 pb-2'>
                        <img src={passlogo} alt="Pass Logo" className="h-16 w-32" />
                        {passData?.visitor.image ? (
                            <img src={`data:image/jpeg;base64,${passData?.visitor.image}`} alt="User" className="h-32 w-32 border-2 border-gray-300 rounded-xl object-cover" />
                        ) : (
                            <div className="h-32 w-32 border-2 border-gray-300 flex items-center justify-center text-white bg-customGreen rounded-xl">
                                {passData?.visitor.first_name ? passData?.visitor.first_name.charAt(0) : 'N/A'}
                            </div>
                        )}
                    </div>
                </div>
                <div className="col-span-2 flex flex-col space-y-4">
                    
                    <div className='p-2 shah-class'>
                        <div className="pass-head"><h1 className="text-xl font-bold">{t("Temporary Entry Pass")}</h1></div>
                        <div className="shah_image_logo"><img src={modlogo} alt="" /></div>
                        <div className="nd-box">
                            <InfoItem label={t("Name")} value={`${passData?.visitor.first_name} ${passData?.visitor.last_name}`} />
                            <InfoItem label={t("Type")} value={passData?.visitor.visitor_type} />
                            <InfoItem label={t("To Visit")} value={passData?.whom_to_visit} />
                            <InfoItem label={t("Department")} value={passData?.visiting_department} />
                        </div>
                        <InfoItem label={t("Valid Till")} value={new Date(passData?.valid_until).toLocaleString('en-IN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false })} />
                        <InfoItem label={t("Purpose")} value={passData?.visiting_purpose} />
                        {/* <InfoItem label={t("Zone")} value={passData?.zone_names.join(", ")} /> */}
                        <div className="pass_note"><span> {t("Note")} : </span>{passData?.pass_note}</div>
                        
                    </div>
                </div>
            </div>
            </Paper>
        </Dialog>
    );
};

const InfoItem = ({ label, value }) => (
    <div className="flex items-center space-x-2">
        <span className="font-semibold">{label}:</span>
        <span>{value}</span>
    </div>
);

export default ViewPass;
