import { Injectable } from '@nestjs/common';
import { CreateRecorridoDto } from './dto/create-recorrido.dto';
import { UpdateRecorridoDto } from './dto/update-recorrido.dto';

@Injectable()
export class RecorridoService {
  create(createRecorridoDto: CreateRecorridoDto) {
    return 'This action adds a new recorrido';
  }

  findAll() {
    return `This action returns all recorrido`;
  }

  findOne(id: number) {
    return `This action returns a #${id} recorrido`;
  }

  update(id: number, updateRecorridoDto: UpdateRecorridoDto) {
    return `This action updates a #${id} recorrido`;
  }

  remove(id: number) {
    return `This action removes a #${id} recorrido`;
  }
}
