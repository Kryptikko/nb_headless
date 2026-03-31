export type Activity = {
  name: string
  action: string
}
export type Zone = {
  display_name: string
  description: string
  visual: string
  activities: Array<Activity>
}
