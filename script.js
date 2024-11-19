function parseDateTime(date, time) {
    const [hours, minutes] = time.split(":").map(Number);
    const parsedDate = new Date(date);
    parsedDate.setHours(hours, minutes, 0, 0);
    return parsedDate;
  }
  
  function parseHoursAndMinutesToMinutes(hours, minutes) {
    return hours * 60 + minutes;
  }
  
  function formatDateTime(dateTime) {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };
    return dateTime.toLocaleString("pt-BR", options);
  }
  
  function formatMinutesToHHMM(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
  }
  
  function calculateLead(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const differenceInTime = end.setHours(0, 0, 0, 0) - start.setHours(0, 0, 0, 0); // Diferença ignorando horas
    return differenceInTime / (1000 * 60 * 60 * 24); // Converter milissegundos em dias
  }
  
  document.getElementById("calculateBtn").addEventListener("click", () => {
    const startExpectedDate = document.getElementById("startExpectedDate").value;
    const startExpectedTime = document.getElementById("startExpectedTime").value;
    const endExpectedDate = document.getElementById("endExpectedDate").value;
    const endExpectedTime = document.getElementById("endExpectedTime").value;
    const startRealizedDate = document.getElementById("startRealizedDate").value;
    const startRealizedTime = document.getElementById("startRealizedTime").value;
  
    const mealHours = parseInt(document.getElementById("mealHours").value) || 0;
    const mealMinutes = parseInt(document.getElementById("mealMinutes").value) || 0;
    const overnightHours = parseInt(document.getElementById("overnightHours").value) || 0;
    const overnightMinutes = parseInt(document.getElementById("overnightMinutes").value) || 0;
  
    if (!startExpectedDate || !endExpectedDate || !startRealizedDate) {
      alert("Preencha todas as datas.");
      return;
    }
  
    if (!startExpectedTime || !endExpectedTime || !startRealizedTime) {
      alert("Preencha todos os horários no formato HH:MM.");
      return;
    }
  
    const startExpected = parseDateTime(startExpectedDate, startExpectedTime);
    const endExpected = parseDateTime(endExpectedDate, endExpectedTime);
    const startRealized = parseDateTime(startRealizedDate, startRealizedTime);
  
    const mealDeclaredMinutes = parseHoursAndMinutesToMinutes(mealHours, mealMinutes);
    const overnightDeclaredMinutes = parseHoursAndMinutesToMinutes(overnightHours, overnightMinutes);
  
    const leadDays = calculateLead(startExpectedDate, endExpectedDate);
    const pernoite = 0; // fixado para este exemplo
    const refeicao = 60; // fixado em 1:00:00 (60 minutos)
  
    const jornada =
      (endExpected - startExpected) / (1000 * 60) - refeicao - pernoite; // em minutos
  
    const pernoiteApontada2 = overnightDeclaredMinutes !== 0 ? pernoite : overnightDeclaredMinutes;
  
    const totalMinimo =
      mealDeclaredMinutes +
      pernoiteApontada2 +
      (9 * (leadDays + 1) * 0.8 * 60); // Ajustando total mínimo para jornada * 0.8
    const horaFimMinimo = new Date(startRealized.getTime());
    horaFimMinimo.setMinutes(horaFimMinimo.getMinutes() + totalMinimo);
  
    const totalMaximo =
      mealDeclaredMinutes +
      pernoiteApontada2 +
      (9 * (leadDays + 1) * 1.1 * 60); // Aumentando jornada para 110%
    const horaFimMaximo = new Date(startRealized.getTime());
    horaFimMaximo.setMinutes(horaFimMaximo.getMinutes() + totalMaximo);
  
    // Cálculo de Hora Fim Correto
    const totalCorreto =
      (9 * (leadDays + 1) * 60) + // 9 horas * (leadDays + 1) em minutos
      pernoiteApontada2 +
      mealDeclaredMinutes;
  
    const horaFimCorreto = new Date(startRealized.getTime());
    horaFimCorreto.setMinutes(horaFimCorreto.getMinutes() + totalCorreto);
    
    console.log("Refeição: ", mealDeclaredMinutes,"+ ","Pernoite Apontada 2: ",pernoiteApontada2, "+ ", "resultado lead: ", 9 * (leadDays + 1) * 1.1 * 60, "= ", mealDeclaredMinutes +
    pernoiteApontada2 +
    (9 * (leadDays + 1) * 1.1 * 60) );
    console.log(totalMaximo);
    console.log(totalCorreto);
    console.log(pernoiteApontada2);



    document.getElementById("results").innerHTML = `
      <p><strong>Lead:</strong> ${leadDays} dias</p>
      <p><strong>Pernoite:</strong> ${formatMinutesToHHMM(pernoite)}</p>
      <p><strong>Refeição:</strong> ${formatMinutesToHHMM(refeicao)}</p>
      <p><strong>Jornada:</strong> ${formatMinutesToHHMM(jornada)}</p>
      <p><strong>Hora Fim Mínimo:</strong> ${formatDateTime(horaFimMinimo)}</p>
      <p><strong>Hora Fim Máximo:</strong> ${formatDateTime(horaFimMaximo)}</p>
      <p><strong>Hora Fim Correto:</strong> ${formatDateTime(horaFimCorreto)}</p>
    `;
  });
