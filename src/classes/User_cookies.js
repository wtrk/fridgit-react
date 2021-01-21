var User_cookies = (function() {
    var Serial = "";
    var Firstname = "";
    var Lastname = "";
    var Dob = "";
    var Isadmin = "";
    var Username = "";
  
    var getFirstname = function() {
      return Firstname;    // Or pull this from cookie/localStorage
    };
  
    var setFirstname = function(Firstname1) {
       Firstname = Firstname1;     
      // Also set this in cookie/localStorage
    };



    var getLastname = function() {
        return Lastname;    // Or pull this from cookie/localStorage
      };
    
      var setLastname = function(Lastname1) {
         Lastname = Lastname1;     
        // Also set this in cookie/localStorage
      };



      var getSerial = function() {
        return Serial;    // Or pull this from cookie/localStorage
      };
    
      var setSerial = function(serial1) {
         Serial = serial1;     
        // Also set this in cookie/localStorage
      };


      
      var getUsername = function() {
        return Username;    // Or pull this from cookie/localStorage
      };
    
      var setUsername = function(Username1) {
        Username = Username1;     
        // Also set this in cookie/localStorage
      };


    
  
    return {
      setFirstname: setFirstname,
      getFirstname:getFirstname,

      setSerial: setSerial,
      getSerial:getSerial,

      setLastname: setLastname,
      getLastname:getLastname,

      setUsername: setUsername,
      getUsername:getUsername
    }
  
  })();
  
  export default User_cookies;