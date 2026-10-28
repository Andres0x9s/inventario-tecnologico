
import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsIn,
  IsDateString,
  IsOptional,
  Matches,
} from 'class-validator';

export class CreateEquipoDto {

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  codigoInventario!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  nombre!: string;

  @IsString()
  @IsNotEmpty()
  tipo!: string;

  @IsString()
  @IsNotEmpty()
  marca!: string;

  @IsString()
  @IsNotEmpty()
  modelo!: string;

  @IsString()
  @IsNotEmpty()
  ubicacion!: string;

  @IsIn(['Disponible', 'En uso', 'Mantención', 'Baja'])
  estado!: 'Disponible' | 'En uso' | 'Mantención' | 'Baja';

  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  @IsDateString({ strict: true })
  fechaAdquisicion!: string;

  @IsOptional()
  @IsString()
  observaciones?: string;
}
