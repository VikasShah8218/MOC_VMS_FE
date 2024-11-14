import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {translation: {
    "welcome": "Welcome to MOD",
    "Dashboard":"Dashboard",
    "Visitor":"Visitors",
    "Users":"Users",
    "Passes":"Passes",
    "Reports":"Reports",
    "Configure":"Configure",
    "FAQ":"FAQ",
    

    "Weekly Visitors":"Weekly Visitors",
    "Today's Visitors":"Today's Visitors",
    "Visits":"Visits",
    "People in Zones":"People in Zones",
    "Image":"Image",

    "Name": "Name",
    "Remaining Time": "Remaining Time",
    "Phone No": "Phone No",
    "Government Type": "Government Type",
    "Government ID": "Government ID"
}},

  hn: {translation: {
    "welcome": "ऍम.ओ.डी. आपका स्वागत है",
    "Dashboard":"डैशबोर्ड",
    "Visitor":"आगंतुक",
    "Visitors":"आगंतुक",
    "Users":"उपयोगकर्ता",
    "Passes":"पास",
    "Reports":"रिपोर्ट",
    "Configure":"कॉन्फ़िगर",
    "FAQ":"अक्सर पूछे जाने वाले प्रश्न",

    "Weekly Visitors":"साप्ताहिक आगंतुक",
    "Today's Visitors":"आज के आगंतुक",
    "Visits":"विजिट्स",
    "People in Zones":"क्षेत्रों में लोग",
    "Image":"चित्र",
    "Zone":"क्षेत्र",
    "Zones":"क्षेत्र",

    "Name": "नाम",
    "Remaining Time": "शेष समय",
    "Phone No": "फोन नंबर",
    "Government ID Type": "सरकारी प्रमाण प्रकार",
    "Government ID": "सरकारी प्रमाण",
    "Name":"नाम",
    "Type":"प्रकार",
    "Email":"ईमेल",
    "Action":"कार्रवाइ",
    "Add New": "नया जोड़ें",

    "Search by first name": "पहले नाम से खोजें",
    "Search by last name": "अंतिम नाम से खोजें",
    "Search by phone number": "फोन नंबर से खोजें",
    "Search by govt ID number": "सरकारी आईडी नंबर से खोजें",
    "per page": "प्रति पृष्ठ",
    
    "View": "देखें",
    "Update": "अपडेट करें",
    "Delete": "हटाएं",
    "Generate Pass": "पास बनाएं",

    "Visitor Type": "आगंतुक प्रकार",
    "Address": "पता",
    "Gov ID Type": "सरकारी आईडी प्रकार",
    "Government Type": "सरकारी आईडी प्रकार",
    "Gov ID No": "सरकारी आईडी नंबर",
    "Blood Group": "रक्त समूह",
    "Blacklisted": "ब्लैकलिस्टेड",
    "Blacklist": "ब्लैकलिस्ट",

    "First Name": "पहला नाम",
    "Last Name": "अंतिम नाम",
    "Signature": "हस्ताक्षर",
    "Back": "वापस",
    "Save": "सहेजें",
    "Capture Image": "चित्र कैप्चर करें",
    "Capture Signature": "हस्ताक्षर कैप्चर करें",
    "Continue":"जारी रखे",
    "Select Blood Group": "रक्त समूह चुनें",

    "User Image": "उपयोगकर्ता चित्र",
    "User Name": "उपयोगकर्ता नाम",
    "Username": "उपयोगकर्ता नाम",  
    "User Type": "उपयोगकर्ता प्रकार",
    "Employee Code": "कर्मचारी कोड",
    "Work Location": "कार्य स्थान",
    "Department": "विभाग",
    "Password": "पासवर्ड",
    "Confirm Password": "पासवर्ड की पुष्टि करें",
    "Add New User": "नया उपयोगकर्ता जोड़ें",
    "Reset Password": "पासवर्ड रीसेट करें",
    "Is Active": "सक्रिय है ?",
    "Is Staff": "स्टाफ है ?",


    "Visitor Name": "आगंतुक का नाम",
    "Purpose": "उद्देश्य",
    "Whom To Visit": "किससे मिलना है",
    "Visiting Department": "मिलने का विभाग",
    "Created On": "बनाया गया",
    "Valid Until": "मान्य तिथि",
    "To Visit": "मिलने के लिए",
    "Valid Till": "तक मान्य",
    "Temporary Entry Pass": "अस्थायी प्रवेश पास",


    "Frequently Asked Question": "अक्सर पूछे जाने वाले प्रश्न",
    "How to Create an Appointment": "अपॉइंटमेंट कैसे बनाएं",
    "Click on the 'create appointment' button from the sidebar or the dashboard, then fill in the details and click on the create button.": "साइडबार या डैशबोर्ड से 'अपॉइंटमेंट बनाएं' बटन पर क्लिक करें, फिर विवरण भरें और बनाएं बटन पर क्लिक करें।",
    "How to Add a new Visitor": "नए आगंतुक को कैसे जोड़ें",
    "Click on the 'add new visitor' button, then take or select a picture. If there are multiple pictures, fill in the details and finally submit after signature.": "नए आगंतुक को जोड़ने के लिए 'नया आगंतुक जोड़ें' बटन पर क्लिक करें, फिर चित्र लें या चुनें। यदि कई चित्र हैं, तो विवरण भरें और अंत में हस्ताक्षर के बाद जमा करें।",
    "How to Generate a Pass": "पास कैसे बनाएं",
    "You can generate a pass directly from the visitor table by filling the details, or by choosing from the face recognition table.": "आप विवरण भरकर सीधे आगंतुक तालिका से पास बना सकते हैं, या चेहरा पहचान तालिका से चुन सकते हैं।",
    "How to Add an Employee": "कर्मचारी कैसे जोड़ें",
    "By clicking on the 'add employee' button from the sidebar and filling in the details in the form.": "साइडबार से 'कर्मचारी जोड़ें' बटन पर क्लिक करके और फॉर्म में विवरण भरकर।",
    "How Can We See Visitors/Passes/Appointments/Employees": "हम आगंतुकों/पास/अपॉइंटमेंट/कर्मचारियों को कैसे देख सकते हैं",
    "We can easily see all details listing from the sidebar.": "हम आसानी से साइडबार से सभी विवरण सूची देख सकते हैं।",

    "Adams": "एडम्स",
    "Adam": "एडम",
    // "Key": "चाबियाँ",
    "Key": "की.",
    "Keys": "चाबियाँ",
    "Readers": "रीडर्स ",
    "Guard-Reader Mappings": "गार्ड-रीडर मैपिंग",
    
    "Search Adam Name": "एडम नाम खोजें",
    "Search Zone Name": "क्षेत्र नाम खोजें",
    "Search Key": "कुंजी खोजें",
    "Search": "खोजें",
    "ID":"आई. डी.",
    "IP":"आई. पी.",
    "Allow Re-Entry": "पुनः प्रवेश की अनुमति",
    "Updated On": "अपडेट किया गया",
    "Port":"पोर्ट",
    "New": "नया",
    "RFID":"अर.ऍफ़.आई.डी.",
    "Is Assigned": "सौंपा गया है",
    "Pass":"पास",
    "Moxa":"मोक्सा ",
    "COM":"कॉम",
    "Reader":"रीडर",
    "Module":"मॉड्यूल",
    "Visitor Management System":"विज़िटर प्रबंधन प्रणाली"
  
    
}}
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already does escaping
    }
  });

export default i18n;
