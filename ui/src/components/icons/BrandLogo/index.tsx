"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

import BrandLightSmall from "./brand_light_small.svg"
import BrandDarkSmall from "./brand_dark_small.svg"
import BrandLightText from "./brand_light_text.svg"
import BrandDarkText from "./brand_dark_text.svg"

export function LogoIcon(props: React.SVGProps<SVGSVGElement>) {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const Icon = theme === "dark" ? BrandDarkSmall : BrandLightSmall
  return <Icon {...props} />
}

export function LogoText(props: React.SVGProps<SVGSVGElement>) {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const Icon = theme === "dark" ? BrandDarkText : BrandLightText
  return <Icon {...props} />
}
