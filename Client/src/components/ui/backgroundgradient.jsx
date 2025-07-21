
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

export const BackgroundGradient = ({
  children,
  className,
  containerClassName,
  animate = true,
}) => {
  const variants = {
    initial: {
      backgroundPosition: "0 50%",
    },
    animate: {
      backgroundPosition: ["0, 50%", "100% 50%", "0 50%"],
    },
  };

  const transition = animate
    ? {
        duration: 5,
        repeat: Infinity,
        repeatType: "reverse",
      }
    : undefined;

  const style = {
    backgroundSize: animate ? "400% 400%" : undefined,
  };

  const bgClass =
    "bg-[radial-gradient(circle_farthest-side_at_0_100%,#00ccb1,transparent),radial-gradient(circle_farthest-side_at_100%_0,#7b61ff,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#ffc414,transparent),radial-gradient(circle_farthest-side_at_0_0,#1ca0ff,#141316)]";

  return (
    <div className={cn("relative p-[4px] group", containerClassName)}>
      <motion.div
        variants={animate ? variants : undefined}
        initial={animate ? "initial" : undefined}
        animate={animate ? "animate" : undefined}
        transition={transition}
        style={style}
        className={cn(
          "absolute inset-0 rounded-3xl z-[1] opacity-60 group-hover:opacity-100 blur-xl transition duration-500 will-change-transform",
          bgClass
        )}
      />
      <motion.div
        variants={animate ? variants : undefined}
        initial={animate ? "initial" : undefined}
        animate={animate ? "animate" : undefined}
        transition={transition}
        style={style}
        className={cn(
          "absolute inset-0 rounded-3xl z-[1] will-change-transform",
          bgClass
        )}
      />
      <div className={cn("relative z-10", className)}>{children}</div>
    </div>
  );
};
