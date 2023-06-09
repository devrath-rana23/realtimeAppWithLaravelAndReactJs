import React, { Component, ReactNode } from 'react'
import { AuthorAtrr, BookAtrr, BookProps } from '../interface/book-interface';

export default class book extends Component {
    constructor(props: BookProps) {
        super(props);

        this.state = {
            notification: false,
            books: [],
        };
    }

    private async fetchData() {
        await fetch(`${process.env.REACT_APP_API_URL}/api/books`)
            .then((response) => response.json())
            .then((res) => {
                this.setState({
                    books: res.data,
                });
            });
    }

    private pusherEvent() {
        var pusher = new Pusher(`${process.env.REACT_APP_PUSHER_API_KEY}`, {
            cluster: `${process.env.REACT_APP_PUSHER_CLUSTER}`,
        });

        var channel = pusher.subscribe("book-store");
        channel.bind("book-event", (data: any) => {
            this.setState({
                notification: true,
                books: [...this.state.books, data.book],
            });
        });
    }

    public render(): ReactNode {
        return (
            <div style={{ padding: "3em" }}>
                <h1> Books </h1>
                {this.state.notification ? (
                    <div className="alert">New Book is Added!</div>
                ) : (
                    ""
                )}

                <table>
                    <tr>
                        <th>ISBN</th>
                        <th>Name</th>
                        <th>Page</th>
                        <th>Year</th>
                        <th>Publisher</th>
                        <th>Authors</th>
                    </tr>
                    {this.state.books.map((book: BookAtrr) => {
                        return (
                            <tr>
                                <td>{book.isbn}</td>
                                <td>{book.name}</td>
                                <td>{book.page}</td>
                                <td>{book.year}</td>
                                <td>
                                    {book.publisher
                                        ? book.publisher.fname + " " + book.publisher.lname
                                        : ""}
                                </td>
                                <td>
                                    {book.authors
                                        ? book.authors.map((item: AuthorAtrr) => {
                                            return <p>{item.fname + " " + item.lname}</p>;
                                        })
                                        : ""}
                                </td>
                            </tr>
                        );
                    })}
                </table>
            </div>
        );
    }
}
