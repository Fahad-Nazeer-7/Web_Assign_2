import { Component } from 'react'

const STORAGE_KEY = 'inventoryAuditLogs'

class AuditLogger extends Component {
  constructor(props) {
    super(props)
    this.state = {
      logs: [],
      notice: '',
    }
    this.noticeTimer = null
  }

  componentDidMount() {
    try {
      const savedLogs = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
      this.setState({ logs: Array.isArray(savedLogs) ? savedLogs : [] })
    } catch {
      this.setState({ logs: [] })
    }
  }

  componentDidUpdate(previousProps, previousState) {
    const newEntry = this.props.latestLog
    const previousEntry = previousProps.latestLog

    if (newEntry && newEntry.id !== previousEntry?.id) {
      const alreadySaved = this.state.logs.some((log) => log.id === newEntry.id)

      if (!alreadySaved) {
        const updatedLogs = [newEntry, ...this.state.logs].slice(0, 50)
        this.setState({
          logs: updatedLogs,
          notice: newEntry.message || 'Inventory updated',
        })

        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLogs))
        } catch {
          // The logger still works for this session if storage is unavailable.
        }

        clearTimeout(this.noticeTimer)
        this.noticeTimer = setTimeout(() => {
          this.setState({ notice: '' })
        }, 2500)
      }
    }

    if (previousState.logs !== this.state.logs) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state.logs))
      } catch {
        // Keep the visible log even if the browser blocks localStorage.
      }
    }
  }

  componentWillUnmount() {
    clearTimeout(this.noticeTimer)
  }

  render() {
    const { logs, notice } = this.state

    return (
      <section className="audit-logger" aria-label="Recent activity">
        {notice && (
          <div className="audit-toast" role="status">
            {notice}
          </div>
        )}

        <h2>Recent activity</h2>
        {logs.length === 0 ? (
          <p>No activity yet.</p>
        ) : (
          <ul>
            {logs.map((log) => (
              <li key={log.id}>
                <strong>{log.action}</strong>
                {log.details && <span> - {log.details}</span>}
                <small>
                  {log.timestamp
                    ? new Date(log.timestamp).toLocaleString()
                    : ''}
                </small>
              </li>
            ))}
          </ul>
        )}
      </section>
    )
  }
}

export default AuditLogger
