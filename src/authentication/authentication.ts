let authentication: boolean = false;
let lastActiveTime: number | null = null;

export const setAuthentication = (value: boolean) => {
  authentication = value;
  if (value) {
    lastActiveTime = Date.now();
    localStorage.setItem('authentication', 'true');
    localStorage.setItem('lastActiveTime', lastActiveTime.toString());
  } else {
    lastActiveTime = null;
    localStorage.removeItem('authentication');
    localStorage.removeItem('lastActiveTime');
  }
};

export const getAuthentication = (): boolean => {
  const authValue = localStorage.getItem('authentication');
  const lastActiveTimeString = localStorage.getItem('lastActiveTime');
  if (authValue && lastActiveTimeString) {
    const lastActiveTime = parseInt(lastActiveTimeString, 10);
    const currentTime = Date.now();
    const elapsedTime = currentTime - lastActiveTime;
    if (elapsedTime < 7200000) { 
      return true;
    } else {
      setAuthentication(false);
      return false;
    }
  }
  return false;
};
