This MVC5 Web App is an open source wen app. It's available for all profesional users of etfreporting.com
After downloading the code, open the project with Visual studio and change the following settings:

Before changing the following settings, you must have an active account registered on etfreporting.com (not access with Google or LinkedIn). Your acount must be marked as "profesional".

## Open the  config file in the folder /ETFTemplate/Configuration 
All settings are located in this xml file.

## How to use etfreporting.com API services
- Go to the key "ServicesUrl" and verify the value is fixed to the server URL "https://etfreporting.com"
- Go to the key "UserName" and change the value with your username on etfreporting.com
- Go to the key "UserPassword" and change the value with your password on etfreporting.com

After updating these keys, your webapp could be tested to verify that all controllers (files located in folder /Scripts/controllers) are operationals. If not, please, track the errors in the signin controller.

## How to setup your profile
- Go to the key "UserEmail" and change the value with your email
- Go to the key "UserSignature" and change the value with your full name
- Go to the key "UserSignature2" and change the value with your job title
- Go to the key "UserPhoneNumber" and change the value with your phone number
- Go to the key "UserImageUrl" and change the value with the URL of your picture
- Go to the key "UserWebSite" and change the value with the URL of your website

## How to setup your app
- Go to the key "PortalName" and change the value with the title of your portal
- Go to the key "RoboName" and change the value with the title of your robo advisor
- Go to the key "OrderBook" and change the value with the title of your order book
- Go to the key "Section-Sustain" and change the value to true if you want to dispay a sustainable section
- 
## How to setup your robo advisor
Your robo advisor will use and apply a questionnaire created and managed on etfreporting.com
- Go to the key "LeadQuestionnaire" and change the value with your phone number
- Go to the key "ManagementFeesRate" and change the value with your management fee rate (ie 70 means 0.70%)
- Go to the key "ManagementFeesPeriod" and change the value with the period of fees payment 
