import Play from 'virtual:icons/ph/play'
import Pause from 'virtual:icons/ph/pause'
import Reload from 'virtual:icons/ph/arrow-counter-clockwise'
import Power from 'virtual:icons/ph/power'

export type IconComponent = typeof Icons[keyof typeof Icons]

export const Icons = {
  Play,
  Pause,
  Reload,
  Power,
}
