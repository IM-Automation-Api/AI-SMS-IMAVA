
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, GripVertical } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const activities = [
  {
    id: 1,
    type: "comment",
    user: {
      name: "John Doe",
      avatar: "/images/avatar2.png",
      initials: "JD",
      color: "bg-indigo-500",
    },
    content: "Comentou na tarefa 'Redesign da página inicial'",
    time: "10 min atrás",
    iconBg: "bg-indigo-500",
  },
  {
    id: 2,
    type: "document",
    user: {
      name: "Alice Brown",
      avatar: "/images/avatar6.png",
      initials: "AB",
      color: "bg-pink-500",
    },
    content: "Adicionou documento 'Especificações do projeto'",
    time: "1 hora atrás",
    iconBg: "bg-blue-500",
  },
  {
    id: 3,
    type: "task",
    user: {
      name: "Carlos Diaz",
      avatar: "/images/avatar3.png",
      initials: "CD",
      color: "bg-amber-500",
    },
    content: "Completou a tarefa 'Implementar autenticação'",
    time: "3 horas atrás",
    iconBg: "bg-green-500",
  },
  {
    id: 4,
    type: "team",
    user: {
      name: "Emma Foster",
      avatar: "/images/avatar7.png",
      initials: "EF",
      color: "bg-orange-500",
    },
    content: "Adicionou Gabriel ao time de Design",
    time: "5 horas atrás",
    iconBg: "bg-purple-500",
  },
  {
    id: 5,
    type: "comment",
    user: {
      name: "Gabriel Harris",
      avatar: "/images/avatar1.png",
      initials: "GH",
      color: "bg-yellow-500",
    },
    content: "Comentou na tarefa 'Otimização de performance'",
    time: "Ontem",
    iconBg: "bg-indigo-500",
  },
]

export function ActivitiesCard() {
  return (
    <>
      <CardHeader className="flex flex-row items-center justify-between pb-2 px-4">
        <div className="flex items-center">
          <GripVertical className="h-4 w-4 text-gray-400 mr-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          <CardTitle className="text-sm font-medium">Activities</CardTitle>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="px-4 pb-4 h-[350px] overflow-auto">
        <div className="relative pl-5">
          <div className="absolute top-0 bottom-0 left-2 w-0.5 bg-gray-200"></div>

          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="relative">
                <div className="absolute -left-5 mt-1">
                  <Avatar className="h-4 w-4 ring-2 ring-white">
                    <AvatarImage src={activity.user.avatar} />
                    <AvatarFallback className={activity.user.color}>{activity.user.initials}</AvatarFallback>
                  </Avatar>
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center mb-1">
                    <span className="text-xs font-medium">{activity.user.name}</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{activity.content}</p>
                  <span className="text-[10px] text-gray-500">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </>
  )
}
