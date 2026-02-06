import React from 'react'
import { useParams } from 'react-router-dom'

export default function ApplyPosition(){
  const { offeringId } = useParams()
  return (
    <div className="page-card">
      <h2>Apply for Position</h2>
      <p>Applying for offering: {offeringId}</p>
    </div>
  )
}
