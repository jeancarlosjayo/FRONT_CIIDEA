export class DateFormat{
  constructor(date) {
    if( typeof date === 'string' ){
      this.day   = parseInt(date.slice(0,2));
      this.month = parseInt(date.slice(3,5))-1;
      this.year  = parseInt(date.slice(6,10));      
    }else if( typeof date === 'object' ){
      this.day   = parseInt(date.getDate());
      this.month = parseInt(date.getMonth())+1;
      this.year  = parseInt(date.getFullYear());
    }
    this.date = date;
  }

  getDate(){
    //console.log(this.day," ",this.month," ",this.year)
    return new Date(this.year,this.month,this.day)
  }

  getStringDate(){
    //console.log(this.day," ",this.month," ",this.year)
    let stringDay   = this.day.valueOf();
    let stringMonth = this.month.valueOf();
    
    if(this.day < 10){
      stringDay = '0'+stringDay;
    }

    if(this.month < 10){
      stringMonth = '0'+stringMonth;
    }

    return stringDay+"/"+stringMonth+"/"+this.year;
  }

  getStringDay(){
    let stringDay   = this.day.valueOf();
    if(this.day < 10){ stringDay = '0'+stringDay }
    return stringDay;
  }

  getStringMonth(){
    let stringMonth = this.month.valueOf();
    if(this.month < 10){stringMonth = '0'+stringMonth }
    return stringMonth;
  }

  getFormatDate1(){
    let stringDay   = this.day.valueOf();
    let stringMonth = this.month.valueOf();
    
    if(this.day < 10){
      stringDay = '0'+stringDay;
    }

    if(this.month < 10){
      stringMonth = '0'+stringMonth;
    }

    return this.year+"-"+stringMonth+"-"+stringDay;
  }

  getFormatDate2(){
    let stringDay   = this.day.valueOf();
    let stringMonth = this.month.valueOf();
    
    if(this.day < 10){
      stringDay = '0'+stringDay;
    }

    if(this.month < 10){
      stringMonth = '0'+stringMonth;
    }

    return stringDay+"/"+stringMonth+"/"+this.year;
  }

  getFormatDate3(){
    let stringDay   = this.day.valueOf();
    let stringDayWeek = this.date.getDay();
    let stringLongDayWeek = "";
    let stringMonth = "";

    if(this.day < 10){ stringDay = '0'+stringDay }

    if(this.month === 1){ stringMonth = "Enero" }
    else if( this.month === 2 ){ stringMonth = "Febrero" }
    else if( this.month === 3 ){ stringMonth = "Marzo" }
    else if( this.month === 4 ){ stringMonth = "Abril" }
    else if( this.month === 5 ){ stringMonth = "Mayo" }
    else if( this.month === 6 ){ stringMonth = "Junio" } 
    else if( this.month === 7 ){ stringMonth = "Julio" } 
    else if( this.month === 8 ){ stringMonth = "Agosto" } 
    else if( this.month === 9 ){ stringMonth = "Setiembre" } 
    else if( this.month === 10 ){ stringMonth = "Octubre" } 
    else if( this.month === 11 ){ stringMonth = "Noviembre" } 
    else if( this.month === 12 ){ stringMonth = "Diciembre" } 

    if(stringDayWeek === 1){ stringLongDayWeek = "Lunes" }
    else if( stringDayWeek === 2 ){ stringLongDayWeek = "Martes" }
    else if( stringDayWeek === 3 ){ stringLongDayWeek = "Miercoles" }
    else if( stringDayWeek === 4 ){ stringLongDayWeek = "Jueves" }
    else if( stringDayWeek === 5 ){ stringLongDayWeek = "Viernes" }
    else if( stringDayWeek === 6 ){ stringLongDayWeek = "Sabado" }
    else if( stringDayWeek === 0 ){ stringLongDayWeek = "Domingo" }

    return stringLongDayWeek +", "+stringDay+" de "+stringMonth+" del "+this.year;

  }

  getFormatDate4(){
    let stringDay   = this.day.valueOf();
    let stringMonth = this.month.valueOf();
    
    if(this.day < 10){
      stringDay = '0'+stringDay;
    }

    if(this.month < 10){
      stringMonth = '0'+stringMonth;
    }

    return this.year+""+stringMonth+""+stringDay;
  }

}