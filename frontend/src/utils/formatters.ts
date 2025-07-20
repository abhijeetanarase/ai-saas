export const fromatField= (field:string , trimUntil : number):string=>{
    const formattedString = field.slice(0,1).toLocaleUpperCase() + field.slice(1);
  if (formattedString.length > trimUntil) {
     return formattedString.slice(0 , trimUntil) + '...';
  }
    return formattedString;
}