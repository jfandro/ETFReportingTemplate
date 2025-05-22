using System;
using System.Configuration;


namespace ETFTemplate.Helpers
{
    public static class ApplicationHelper
    {
        /// <summary>
        /// Returns the name of application
        /// </summary>
        public static string ApplicationName
        {
            get { return ConfigurationManager.AppSettings["ApplicationName"]; }
        }

        /// <summary>
        /// Returns the name of portal
        /// </summary>
        public static string PortalName
        {
            get { return ConfigurationManager.AppSettings["PortalName"]; }
        }

        /// <summary>
        /// Returns the name of robo
        /// </summary>
        public static string RoboName
        {
            get { return ConfigurationManager.AppSettings["RoboName"]; }
        }

        /// <summary>
        /// Returns the name of order book
        /// </summary>
        public static string OrderBook
        {
            get { return ConfigurationManager.AppSettings["OrderBook"]; }
        }

        /// <summary>
        /// Returns the name of user connected to services
        /// </summary>
        public static string UserName
        {
            get { return ConfigurationManager.AppSettings["UserName"]; }
        }

        /// <summary>
        /// Returns the password of user connected to services
        /// </summary>
        public static string UserPassword
        {
            get { return ConfigurationManager.AppSettings["UserPassword"]; }
        }

        /// <summary>
        /// Returns the password of user connected to services
        /// </summary>
        public static string UserPhoneNumber
        {
            get { return ConfigurationManager.AppSettings["UserPhoneNumber"]; }
        }

        /// <summary>
        /// Returns the password of user connected to services
        /// </summary>
        public static string UserImageUrl
        {
            get { return ConfigurationManager.AppSettings["UserImageUrl"]; }
        }
        /// <summary>
        /// Returns the user signature added at the end of sent emails
        /// </summary>
        public static string UserSignature
        {
            get { return ConfigurationManager.AppSettings["UserSignature"]; }
        }

        /// <summary>
        /// Returns the user signature added at the end of sent emails
        /// </summary>
        public static string UserSignature2
        {
            get { return ConfigurationManager.AppSettings["UserSignature2"]; }
        }

        /// <summary>
        /// Returns the path of the api services
        /// </summary>
        public static string ServicesUrl
        {
            get { return ConfigurationManager.AppSettings["ServicesUrl"]; }
        }

        /// <summary>
        /// Returns the path of the app logo
        /// </summary>
        public static string LogoUrl
        {
            get { return ConfigurationManager.AppSettings["LogoUrl"]; }
        }

        /// <summary>
        /// Returns the path of the client site
        /// </summary>
        public static string UserWebSite
        {
            get { return ConfigurationManager.AppSettings["UserWebSite"]; }
        }

        /// <summary>
        /// Returns the main email
        /// </summary>
        public static string UserEmail
        {
            get { return ConfigurationManager.AppSettings["UserEmail"]; }
        }

        /// <summary>
        /// Returns the contact email
        /// </summary>
        public static string ContactEmail
        {
            get { return ConfigurationManager.AppSettings["ContactEmail"]; }
        }

        /// <summary>
        /// Returns the path of the client site
        /// </summary>
        public static string ExtendedStyle
        {
            get { return ConfigurationManager.AppSettings["extendedStyle"]; }
        }

        /// <summary>
        /// Returns true if current app is a template
        /// </summary>
        public static bool IsTemplate
        {
            get { return Convert.ToBoolean(ConfigurationManager.AppSettings["ApplicationTemplate"]); }
        }

        /// <summary>
        /// Returns the ID of KYC questionnaire
        /// </summary>
        public static int LeadQuestionnaire
        {
            get { return Convert.ToInt16(ConfigurationManager.AppSettings["LeadQuestionnaire"]); }
        }

        /// <summary>
        /// Returns the key of ESG rating
        /// </summary>
        public static string ESGRating
        {
            get { return ConfigurationManager.AppSettings["ESGRating"]; }
        }

        /// <summary>
        /// Returns the key of Implicite temperature raise
        /// </summary>
        public static string ESGITR
        {
            get { return ConfigurationManager.AppSettings["ESGITR"]; }
        }

        /// <summary>
        /// Returns the question code linked to the thematics
        /// </summary>
        public static string TargetedThematics
        {
            get { return ConfigurationManager.AppSettings["TargetedThematics"]; }
        }

        /// <summary>
        /// Returns the question code linked to the exclusion
        /// </summary>
        public static string ExcludedThematics
        {
            get { return ConfigurationManager.AppSettings["ExcludedThematics"]; }
        }

        /// <summary>
        /// Returns the rate of management fees
        /// </summary>
        public static int ManagementFeesRate
        {
            get { return Convert.ToInt32(ConfigurationManager.AppSettings["ManagementFeesRate"]); }
        }

        /// <summary>
        /// Returns the payment period id for management fees
        /// </summary>
        public static int ManagementFeesPeriod
        {
            get { return Convert.ToInt32(ConfigurationManager.AppSettings["ManagementFeesPeriod"]); }
        }
    }

    /// <summary>
    /// A static class for videos
    /// </summary>
    public static class VideoHelper
    {
        /// <summary>
        /// Returns true if video for start
        /// </summary>
        public static bool Starting
        {
            get { return Convert.ToBoolean(ConfigurationManager.AppSettings["Video-Starting"]); }
        }

        /// <summary>
        /// Returns true if video for questionnaire
        /// </summary>
        public static bool Questionnaire
        {
            get { return Convert.ToBoolean(ConfigurationManager.AppSettings["Video-Questionnaire"]); }
        }

        /// <summary>
        /// Returns true if video for portfolio
        /// </summary>
        public static bool Portfolio
        {
            get { return Convert.ToBoolean(ConfigurationManager.AppSettings["Video-Portfolio"]); }
        }

        /// <summary>
        /// Returns true if video for expositions
        /// </summary>
        public static bool Exposures
        {
            get { return Convert.ToBoolean(ConfigurationManager.AppSettings["Video-Exposures"]); }
        }

        /// <summary>
        /// Returns true if video for contact
        /// </summary>
        public static bool Contact
        {
            get { return Convert.ToBoolean(ConfigurationManager.AppSettings["Video-Contact"]); }
        }
    }

    /// <summary>
    /// A static class for robo settings
    /// </summary>
    public static class RoboHelper
    {
        /// <summary>
        /// Returns the name of robo
        /// </summary>
        public static string Name
        {
            get { return ConfigurationManager.AppSettings["RoboName"]; }
        }

        /// <summary>
        /// Returns the date from which the robo run backtest
        /// </summary>
        public static DateTime StartDate
        {
            get { return Convert.ToDateTime(ConfigurationManager.AppSettings["RoboStartDate"]); }
        }

        /// <summary>
        /// Returns the name of robot javascript
        /// </summary>
        public static string Script
        {
            get { return ConfigurationManager.AppSettings["RoboScript"]; }
        }

        /// <summary>
        /// Returns the ID of linked questionnaire
        /// </summary>
        public static int Questionnaire
        {
            get { return Convert.ToInt16(ConfigurationManager.AppSettings["LeadQuestionnaire"]); }
        }

        /// <summary>
        /// Returns the contact email
        /// </summary>
        public static string ContactEmail
        {
            get { return ConfigurationManager.AppSettings["ContactEmail"]; }
        }
    }
}