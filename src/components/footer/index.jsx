import essilogo from "../../assets/images/essi-logo.png"
import becillogo from '../../assets/images/becil.png';
const Footer = () => {
  return (
    <div className="p-4 fixed bottom-0 w-full" style={{backgroundColor:"white",boxShadow:"rgba(0, 0, 0, 0.24) 0px 3px 8px",display:"flex",flexDirection:"row",justifyContent: "space-between"}}>
      <div className="footer-text" style={{display:"flex",flexDirection:"row"}}>
        <div className="f-text" style={{fontSize:"13px",color:'black'}}>
           Designed and Maintained by 
        </div>
        <div className="image-box" style={{width:"50px",marginLeft:'5px'}}>
          <img style={{width:"100%",marginTop:"3px"}} src={essilogo} alt="" />
        </div>
        
      </div>
      {/* <div className="becil-logo" style={{width:'25px',marginRight:'20%'}}>
        <img style={{width:"100%"}} src={becillogo} alt="" />
      </div> */}
    </div>
  );
};
export default Footer;

