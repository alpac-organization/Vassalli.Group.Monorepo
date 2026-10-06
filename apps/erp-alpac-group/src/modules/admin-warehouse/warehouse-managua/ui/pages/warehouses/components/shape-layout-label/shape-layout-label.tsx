import { Label, Tag, Text } from "react-konva";

type ShapeLayoutLabelProps = {
	x: number;
	y: number;
	text: string;
};

export const ShapeLayoutLabel = ({ x, y, text }: ShapeLayoutLabelProps) => (
	<Label x={x} y={y - 30}>
		<Tag fill="#0f172a" cornerRadius={4} />
		<Text
			text={text}
			fontSize={11}
			fill="#e2e8f0"
			padding={4}
			listening={false}
		/>
	</Label>
);
