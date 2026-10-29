import React from 'react'

/** One item of the off-canvas menu */
export function MenuItem({
  current,
  href,
  label,
}: {
  current: boolean
  href: string
  label: string
}) {
  return (
    <li
      className={`menu-item menu-item-type-custom menu-item-object-custom${current ? ' current-menu-item' : ''}`}
    >
      <a aria-current={current ? 'page' : undefined} href={href}>
        {label}
      </a>
    </li>
  )
}
