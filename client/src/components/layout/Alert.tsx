import { useAppSelector } from '../../hooks'

const Alert = () => {
  const alerts = useAppSelector((state) => state.alert)

  return (
    <>
      {alerts.length > 0 &&
        alerts.map((alert) => (
          <div key={alert.id} className={`alert alert-${alert.alertType}`}>
            {alert.msg}
          </div>
        ))}
    </>
  )
}

export default Alert
