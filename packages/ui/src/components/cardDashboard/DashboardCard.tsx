import { useTheme } from "../../providers/theme-provider";
import { Card } from "../cardDashboard/card/Card";
import { CardDasboardProps } from "./card/card.dashboard.type";
import { CardContent } from "./card/CardContent";
import { CardHeader } from "./card/CardHeader";
import imageDark from "../../assets/image-dark.svg";
import imageLigth from "../../assets/image-dark.svg";

export const DashBoardCard = ({
   title,
   image,
   description,
   onClick,
}: CardDasboardProps) => {
   const { theme } = useTheme();
   const defaultImage = theme === "dark" ? imageDark : imageLigth;

   const handleKeyEvent = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" || e.key === " ") {
         e.preventDefault();
         if (onClick) {
            onClick();
         }
      }
   };

   return (
      <Card
         className="cursor-pointer group flex flex-col h-full"
         onClick={onClick}
         role="button"
         tabIndex={0}
         onKeyDown={handleKeyEvent}
      >
         <CardHeader>
            <div className="absolute inset-0 bg-size-[24px_24px] bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
            
            <img
               src={image || defaultImage}
               alt={title}
               className="w-12 h-12 object-contain relative z-10 group-hover:scale-110 transition-transform duration-300"
            />
         </CardHeader>

         <CardContent className="flex flex-col gap-1"> 

            <h3 className="text-sm font-semibold text-neutral-200 group-hover:text-white transition-colors">
               {title}
            </h3>

            {  
               description && (
                  <p className="text-xs text-neutral-400 leading-relaxed line-clamp-2">
                     {description}
                  </p>
               )
            }
         </CardContent>
      </Card>
   );
};
