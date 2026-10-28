
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Equipo } from './entities/equipo.entity';
import { CreateEquipoDto } from './dto/create-equipo.dto';
import { UpdateEquipoDto } from './dto/update-equipo.dto';

@Injectable()
export class EquiposService {

  constructor(
    @InjectRepository(Equipo)
    private readonly equiposRepository: Repository<Equipo>,
  ) {}

  // CREATE: registrar un equipo
  async create(createEquipoDto: CreateEquipoDto) {
    const equipo = this.equiposRepository.create(createEquipoDto);
    return await this.equiposRepository.save(equipo);
  }

  // READ: obtener todos los equipos
  async findAll() {
    return await this.equiposRepository.find();
  }

  // READ: buscar un equipo por su ID
  async findOne(id: number) {
    const equipo = await this.equiposRepository.findOneBy({ id });

    if (!equipo) {
      throw new NotFoundException(
        `No existe un equipo con el ID ${id}`,
      );
    }

    return equipo;
  }

  // UPDATE: actualizar un equipo
  async update(id: number, updateEquipoDto: UpdateEquipoDto) {
    const equipo = await this.findOne(id);

    this.equiposRepository.merge(equipo, updateEquipoDto);

    return await this.equiposRepository.save(equipo);
  }

  // DELETE: eliminar un equipo
  async remove(id: number) {
    const equipo = await this.findOne(id);

    await this.equiposRepository.remove(equipo);

    return {
      mensaje: `Equipo con ID ${id} eliminado correctamente`,
    };
  }
}
