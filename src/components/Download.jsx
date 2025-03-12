import React from 'react'
import { initializeApp } from 'firebase/app'
import { collection, query, getDocs, getFirestore } from 'firebase/firestore';
import { mkConfig, generateCsv, download } from 'export-to-csv';

export default function Download() {
  const firebaseConfig = {
    apiKey: import.meta.env.PUBLIC_API_KEY ,
    authDomain: import.meta.env.PUBLIC_AUTH_DOMAIN,
    projectId: import.meta.env.PUBLIC_PROJECT_ID,
    storageBucket: import.meta.env.PUBLIC_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.PUBLIC_MESSAGING_SENDER_ID,
    appId: import.meta.env.PUBLIC_API_ID,
    measurementId: import.meta.env.PUBLIC_MEASUREMENT_ID
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
