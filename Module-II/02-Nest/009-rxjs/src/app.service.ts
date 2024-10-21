import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common'; 
import { catchError, firstValueFrom, forkJoin, map, of } from 'rxjs';
 

@Injectable()
export class AppService {

  constructor(private httpService: HttpService) {}

  async getData(query: string) {

    const githubUrl = `https://api.github.com/search/repositories?q=${query}` 
    // const githubUrl = `https://api.github.com.ERROR/search/repositories?q=${query}` 
    const gitlabUrl = `https://gitlab.com/api/v4/projects?search=${query}`
  
    const github$ = this.httpService.get(githubUrl).pipe(
      map(response => response.data.items
        .slice(0, 5)
        .map(item => ({ 
          name: item.name,
          description: item.description
        }))
      ), 
      catchError(error => of({error: `Ошибка при запросе ${githubUrl}: ${error.message}`}))
    )

    const gitlab$ = this.httpService.get(gitlabUrl).pipe(
      map(response => response.data
        .slice(0, 5)
        .map(item => ({ 
          name: item.name, 
          description: item.description
        }))
      ),
      catchError(error => of({error: `Ошибка при запросе ${githubUrl}: ${error.message}`}))
    )

    const o = forkJoin({
      github: github$,
      gitlab: gitlab$
    })

    return await firstValueFrom(o)
  }
}
