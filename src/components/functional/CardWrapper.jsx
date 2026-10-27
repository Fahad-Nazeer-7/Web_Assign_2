function CardWrapper({ children, className = '' }) {
  return <section className={`card-wrapper ${className}`.trim()}>{children}</section>
}

export default CardWrapper
