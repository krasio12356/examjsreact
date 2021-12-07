async function subscribe() 
{
    let response = await fetch("/subscribe");
  
    if (response.status == 502) {
      await subscribe();
    } 
    else if (response.status != 200) 
    {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await subscribe();
    } 
    else 
    {
      let data = await response.json();
      //showMessage(message);
      await subscribe();
    }
  }