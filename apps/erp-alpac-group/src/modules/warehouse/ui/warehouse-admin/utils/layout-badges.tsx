import { Badges } from "@alpac/design-system";
import { RackStatusEnum } from "@app/modules/warehouse/domain/enums/rack-status.enum";
import { SectionStorageTypeEnum } from "@app/modules/warehouse/domain/enums/section-storage-type.enum";
import { SectionTypeEnum } from "@app/modules/warehouse/domain/enums/section-type.enum";
import { getRackStatusLabel, getSectionStorageTypeLabel, getSectionTypeLabel } from "./layout-badges.utils";

export const SectionTypeBadge = ({ value }: { value: string | null }) => {
	const isStorage = value === SectionTypeEnum.Storage.textValue;
	return (
		<Badges
			label={getSectionTypeLabel(value)}
			color={isStorage ? "success" : "gray"}
			className={
				isStorage
					? "bg-[#132a22]! border! border-[#1b3b30]! text-[#4ade80]!"
					: "bg-slate-800! border! border-slate-700! text-slate-400!"
			}
		/>
	);
};

export const SectionStorageTypeBadge = ({ value }: { value: string | null }) => {
	let className = "bg-slate-800! border! border-slate-700! text-slate-400!";
	if (value === SectionStorageTypeEnum.Racks.textValue) {
		className = "bg-[#123C69]! border! border-[#2F6FB2]! text-[#D6ECFF]!";
	} else if (value === SectionStorageTypeEnum.Lots.textValue) {
		className = "bg-[#234A2F]! border! border-[#4FA56A]! text-[#D9FBE2]!";
	}
	return <Badges label={getSectionStorageTypeLabel(value)} color="transparent" className={className} />;
};

export const RackStatusBadge = ({ value }: { value: string | null }) => {
	switch (value) {
		case RackStatusEnum.Available.textValue:
			return (
				<Badges
					label="Disponible"
					color="success"
					className="bg-[#132a22]! border! border-[#1b3b30]! text-[#4ade80]!"
				/>
			);
		case RackStatusEnum.Occupied.textValue:
			return (
				<Badges
					label="Ocupado"
					color="info"
					className="bg-[#123C69]! border! border-[#2F6FB2]! text-[#D6ECFF]!"
				/>
			);
		case RackStatusEnum.UnderMaintenance.textValue:
			return (
				<Badges
					label="En mantenimiento"
					color="warning"
					className="bg-[#3a2c0a]! border! border-[#5c4a12]! text-[#fbbf24]!"
				/>
			);
		case RackStatusEnum.Blocked.textValue:
			return (
				<Badges
					label="Bloqueado"
					color="error"
					className="bg-[#3a1d1d]! border! border-[#5c2424]! text-[#f87171]!"
				/>
			);
		default:
			return (
				<Badges
					label={getRackStatusLabel(value)}
					color="gray"
					className="bg-slate-800! border! border-slate-700! text-slate-400!"
				/>
			);
	}
};

export const ActiveStatusBadge = ({ isActive }: { isActive: boolean }) =>
	isActive ? (
		<Badges
			label="Activa"
			color="success"
			className="bg-[#132a22]! border! border-[#1b3b30]! text-[#4ade80]!"
		/>
	) : (
		<Badges
			label="Inactiva"
			color="gray"
			className="bg-slate-800! border! border-slate-700! text-slate-400!"
		/>
	);