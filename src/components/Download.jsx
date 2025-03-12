import React from 'react'
import { initializeApp } from 'firebase/app'
import { collection, query, getDocs, getFirestore } from 'firebase/firestore';
import { mkConfig, generateCsv, download } from 'export-to-csv';

export default function Download() {
  const firebaseConfig = {
    apiKey: "AIzaSyDxlDVf_ayLbYoIpwjixtKbiXteF6suo5o",
    authDomain: "agricultura-regenerativa-dc9bc.firebaseapp.com",
    projectId: "agricultura-regenerativa-dc9bc",
    storageBucket: "agricultura-regenerativa-dc9bc.appspot.com",
    messagingSenderId: "42998705292",
    appId: "1:42998705292:web:5e3c3e9eaefec5416b5fa9",
    measurementId: "G-Q7B7CDSC1Z"
  };
  const deleteComma = string => string.replace(",", "")
  const csvConfig = mkConfig({
    useKeysAsHeaders: true
  })

  
  let dataComplete = []

  const startProcess = async () => {
    const app = initializeApp(firebaseConfig)
    const db = getFirestore(app)
    const q = query(collection(db, "usersGestionDeProyectos"))
    const querySnapshot = await getDocs(q)
    querySnapshot.forEach((doc) => {
      const {
        cargo,
        email,
        lastName,
        medioWebinar,
        name,
        organization,
        partWebinar,
        participationWebinar,
        proxWebinar,
        sector,

      } = doc.data()

      const dataInd = {
        Nombre: name,
        Apellido: lastName,
        Email: email,
        Organizacion: deleteComma(organization),
        ParticipacionUltWebinarDato: partWebinar,
        MedioWebinar: deleteComma(medioWebinar),
        ParticipationUltWebinarSiNo: participationWebinar,
        Proximo: proxWebinar,
        Cargo: deleteComma(cargo),
        Sector: deleteComma(sector)
      }
      dataComplete.push(dataInd)
    })
    const csv = generateCsv(csvConfig)(dataComplete)
    download(csvConfig)(csv)
  }

  return (
    <>
      <button onClick={startProcess}>Descarga la DB</button>
    </>
  )
}
